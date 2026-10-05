param([ValidateSet('create', 'address', 'deploy')][string]$Action = 'address')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security
$projectPath = Split-Path $PSScriptRoot -Parent
$walletDirectory = Join-Path $projectPath '.wallet'
$walletPath = Join-Path $walletDirectory 'sepolia.json'
Set-Location -LiteralPath $projectPath

if ($Action -eq 'create') {
    if (Test-Path -LiteralPath $walletPath) { throw 'Wallet already exists; refusing to overwrite it.' }
    New-Item -ItemType Directory -Path $walletDirectory -Force | Out-Null
    $walletAcl = New-Object System.Security.AccessControl.DirectorySecurity
    $walletAcl.SetAccessRuleProtection($true, $false)
    $walletIdentity = [System.Security.Principal.WindowsIdentity]::GetCurrent().User
    $walletRule = New-Object System.Security.AccessControl.FileSystemAccessRule($walletIdentity, 'FullControl', 'ContainerInherit,ObjectInherit', 'None', 'Allow')
    $walletAcl.AddAccessRule($walletRule)
    [System.IO.Directory]::SetAccessControl($walletDirectory, $walletAcl)
    $walletData = ('import { Wallet } from "ethers"; const w = Wallet.createRandom(); console.log(JSON.stringify({address:w.address,privateKey:w.privateKey}));' | & node --input-type=module) | ConvertFrom-Json
    if ($LASTEXITCODE -ne 0 -or -not $walletData.privateKey) { throw 'Wallet creation failed.' }
    $keyBytes = [Text.Encoding]::UTF8.GetBytes($walletData.privateKey)
    $encryptedKey = [Security.Cryptography.ProtectedData]::Protect($keyBytes, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
    @{ address = $walletData.address; encryptedPrivateKey = [Convert]::ToBase64String($encryptedKey); protection = 'Windows DPAPI CurrentUser' } | ConvertTo-Json | Set-Content -LiteralPath $walletPath
    [Array]::Clear($keyBytes, 0, $keyBytes.Length)
    $walletData = $null
}

if (-not (Test-Path -LiteralPath $walletPath)) { throw 'Run this script with -Action create first.' }
$savedWallet = Get-Content -LiteralPath $walletPath -Raw | ConvertFrom-Json
Write-Output "Sepolia test wallet: $($savedWallet.address)"

if ($Action -eq 'deploy') {
    $decryptedKey = [Security.Cryptography.ProtectedData]::Unprotect([Convert]::FromBase64String($savedWallet.encryptedPrivateKey), $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
    try {
        $env:SEPOLIA_PRIVATE_KEY = [Text.Encoding]::UTF8.GetString($decryptedKey)
        & npm.cmd run deploy:sepolia
        if ($LASTEXITCODE -ne 0) { throw 'Deployment did not complete.' }
    } finally {
        Remove-Item Env:SEPOLIA_PRIVATE_KEY -ErrorAction SilentlyContinue
        [Array]::Clear($decryptedKey, 0, $decryptedKey.Length)
    }
}
