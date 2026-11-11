import math

def grid(E,N):
    a=6377340.189; f=1/299.3249646; e2=f*(2-f); k=1.000035
    phi0=math.radians(53.5); lon0=math.radians(-8); e1=(1-math.sqrt(1-e2))/(1+math.sqrt(1-e2))
    def meridian(phi):
        return a*((1-e2/4-3*e2**2/64-5*e2**3/256)*phi-(3*e2/8+3*e2**2/32+45*e2**3/1024)*math.sin(2*phi)+(15*e2**2/256+45*e2**3/1024)*math.sin(4*phi)-(35*e2**3/3072)*math.sin(6*phi))
    m=meridian(phi0)+(N-250000)/k
    mu=m/(a*(1-e2/4-3*e2**2/64-5*e2**3/256))
    phi=mu+(3*e1/2-27*e1**3/32)*math.sin(2*mu)+(21*e1**2/16-55*e1**4/32)*math.sin(4*mu)+(151*e1**3/96)*math.sin(6*mu)+(1097*e1**4/512)*math.sin(8*mu)
    ep=e2/(1-e2); sn=math.sin(phi); cs=math.cos(phi); tan=math.tan(phi); t=tan*tan; c=ep*cs*cs
    nu=a/math.sqrt(1-e2*sn*sn); rho=a*(1-e2)/(1-e2*sn*sn)**1.5; D=(E-200000)/(nu*k)
    lat=phi-(nu*tan/rho)*(D**2/2-(5+3*t+10*c-4*c*c-9*ep)*D**4/24+(61+90*t+298*c+45*t*t-252*ep-3*c*c)*D**6/720)
    lon=lon0+(D-(1+2*t+c)*D**3/6+(5-2*c+28*t-3*c*c+8*ep+24*t*t)*D**5/120)/cs
    nu=a/math.sqrt(1-e2*math.sin(lat)**2); x=nu*math.cos(lat)*math.cos(lon); y=nu*math.cos(lat)*math.sin(lon); z=nu*(1-e2)*math.sin(lat)
    rx,ry,rz=[math.radians(v/3600) for v in (-1.042,-0.214,-0.631)]; s=1+8.15e-6
    X=482.53+s*x-rz*y+ry*z; Y=-130.596+rz*x+s*y-rx*z; Z=564.557-ry*x+rx*y+s*z
    aw=6378137.; fw=1/298.257223563; ew=fw*(2-fw); p=math.hypot(X,Y); lon=math.atan2(Y,X); lat=math.atan2(Z,p*(1-ew))
    for _ in range(12):
        nu=aw/math.sqrt(1-ew*math.sin(lat)**2); h=p/math.cos(lat)-nu; lat=math.atan2(Z,p*(1-ew*nu/(nu+h)))
    return math.degrees(lat),math.degrees(lon)
for name,E,N in [('control',315949.03,234923.958),('park gate',313467,234459),('north strand',317100,235676),('mckenny',317264,233340),('castle gate',315439,233973)]:
    print(name,grid(E,N))
