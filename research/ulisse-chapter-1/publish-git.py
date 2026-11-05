import os, subprocess, pathlib
root=pathlib.Path.cwd()
def git(*args,input=None,env=None):
 return subprocess.check_output(['git',*args],input=input,env=env)
git('fetch','origin','docs')
head=git('rev-parse','HEAD').decode().strip()
remote=git('rev-parse','origin/docs').decode().strip()
git('merge-base','--is-ancestor',head,remote)
env=os.environ.copy()
env['GIT_INDEX_FILE']=str(root/'research/ulisse-chapter-1/publication-index')
git('read-tree',remote,env=env)
files=['REVIEW.md','prepare.cjs','publish.sql','position.sql','check.ts','excerpts-reviewed.json','publish-git.py']
for name in files:
 path='research/ulisse-chapter-1/'+name
 blob=git('hash-object','-w','--stdin',input=(root/path).read_bytes()).decode().strip()
 git('update-index','--add','--cacheinfo','100644',blob,path,env=env)
path='research/ulisse-capitolo-1-revisione-preliminare.md'
blob=git('hash-object','-w','--stdin',input=(root/path).read_bytes()).decode().strip()
git('update-index','--add','--cacheinfo','100644',blob,path,env=env)
tree=git('write-tree',env=env).decode().strip()
commit=git('commit-tree',tree,'-p',remote,'-m','Review Telemachus quotations, mentions and Forty Foot position').decode().strip()
git('update-ref','refs/heads/docs',commit,head)
print(commit)
print(git('push','origin','docs').decode())
