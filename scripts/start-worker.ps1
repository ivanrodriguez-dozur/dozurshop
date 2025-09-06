Param()

# Load .env.worker file into environment for the current session
# Resolve script root and env file path
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$envFile = Join-Path $scriptRoot '..\..\.env.worker'
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -and -not ($_ -match '^#')) {
      $parts = $_ -split '='
      if ($parts.Count -ge 2) {
        $name = $parts[0].Trim()
        $value = ($parts[1..($parts.Count-1)] -join '=').Trim()
        # Use ${env:NAME} syntax to set environment variable with dynamic name
        ${env:$name} = $value
      }
    }
  }
} else {
  Write-Host "Warning: .env.worker not found at $envFile"
}

# Start PM2 with the ecosystem file (use absolute path)
$ecosystem = Join-Path $scriptRoot '..\ecosystem.config.js'
if (-not (Test-Path $ecosystem)) {
  Write-Host "ecosystem.config.js not found at $ecosystem"
} else {
  pm2 start $ecosystem --only transcode-worker
}
pm2 save
