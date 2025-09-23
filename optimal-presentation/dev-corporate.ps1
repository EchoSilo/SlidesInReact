# PowerShell script to run dev server with TLS workaround for corporate networks
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
npm run dev:secure