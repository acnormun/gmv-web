export async function checkFrontendVersion(): Promise<string | null> {
  const localVersionResp = await fetch('/version.json')
  const localData = await localVersionResp.json()
  const localVersion = localData.version

  const token = import.meta.env.VITE_GITHUB_TOKEN
  const repoOwner = 'acnormun'
  const repoName = 'gmv-web'
  const filePath = 'version.json'

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    const json = await res.json()
    const remoteContent = atob(json.content)
    const remoteVersion = JSON.parse(remoteContent).version

    if (localVersion !== remoteVersion) {
      return remoteVersion
    }

    return null
  } catch (e) {
    console.error('Erro ao verificar versão do frontend:', e)
    return null
  }
}
