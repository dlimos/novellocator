# Anonymous, read-only checks. No tokens, account or database changes.
$ErrorActionPreference = 'Stop'
$lotrFolder = $PSScriptRoot
$lotrMapIds = @('16abf625a5704ebd90fff024e7d9c476', 'd1639e2fc51748c29de2849832bb53db')
function Get-LotrLayers($items) {
    foreach ($item in $items) {
        $item
        if ($item.layers) { Get-LotrLayers $item.layers }
    }
}
$lotrReport = foreach ($lotrMapId in $lotrMapIds) {
    $lotrMap = Get-Content -LiteralPath "$lotrFolder/$lotrMapId.webmap.json" -Raw | ConvertFrom-Json
    $lotrLayers = @(Get-LotrLayers @($lotrMap.operationalLayers)) + @($lotrMap.baseMap.baseMapLayers)
    $lotrChecks = foreach ($lotrLayer in ($lotrLayers | Where-Object { $_.url -match '^https://' } | Sort-Object url -Unique)) {
        try {
            $lotrService = Invoke-RestMethod -Uri "$($lotrLayer.url)?f=json" -TimeoutSec 25
            $lotrLicense = $null
            if ($lotrLayer.itemId) {
                $lotrItem = Invoke-RestMethod -Uri "https://www.arcgis.com/sharing/rest/content/items/$($lotrLayer.itemId)?f=json" -TimeoutSec 25
                $lotrLicense = $lotrItem | Select-Object id,title,access,licenseInfo,accessInformation
            }
            $lotrCount = $null
            if ($lotrLayer.url -match '/FeatureServer/\d+$' -and !$lotrService.error) {
                $lotrCount = Invoke-RestMethod -Uri "$($lotrLayer.url)/query?where=1%3D1&returnCountOnly=true&f=json" -TimeoutSec 25
            }
            [pscustomobject]@{title=$lotrLayer.title;url=$lotrLayer.url;type=$lotrLayer.layerType;error=$lotrService.error;spatialReference=$lotrService.extent.spatialReference;capabilities=$lotrService.capabilities;copyright=$lotrService.copyrightText;extent=$lotrService.extent;fullExtent=$lotrService.fullExtent;tileInfo=$lotrService.tileInfo;count=$lotrCount;item=$lotrLicense}
        } catch {
            [pscustomobject]@{title=$lotrLayer.title;url=$lotrLayer.url;error=$_.Exception.Message}
        }
    }
    [pscustomobject]@{mapId=$lotrMapId;checkedAtUtc=[DateTime]::UtcNow.ToString('o');spatialReference=$lotrMap.spatialReference;checks=@($lotrChecks)}
}
$lotrReport | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath "$lotrFolder/arcgis-service-audit.json" -Encoding utf8
$lotrReport | ForEach-Object { $_.checks | Select-Object title,type,error,@{n='count';e={$_.count.count}},@{n='license';e={$_.item.licenseInfo}} } | Format-Table -Wrap
