# Corporate Network TLS Solutions

This app now includes multiple solutions for running in corporate networks where SSL certificates are intercepted by firewalls.

## Solutions Implemented

### 1. Modified Anthropic Client
The `lib/anthropic-client.ts` file now includes a custom HTTPS agent that:
- Disables certificate verification (`rejectUnauthorized: false`)
- Adds keepAlive and timeout settings for better connection handling
- Works automatically for all Anthropic API calls

### 2. NPM Scripts
- `npm run dev` - Development with TLS workaround (using cross-env)
- `npm run dev:secure` - Development with standard TLS verification
- `npm run build` - Production build (unchanged)

### 3. Platform-Specific Scripts
For environments where npm scripts don't work:

#### PowerShell (Windows)
```powershell
.\dev-corporate.ps1
```

#### Batch File (Windows)
```batch
dev-corporate.bat
```

#### Manual Environment Variable
```bash
# Linux/Mac
export NODE_TLS_REJECT_UNAUTHORIZED=0
npm run dev:secure

# Windows Command Prompt
set NODE_TLS_REJECT_UNAUTHORIZED=0
npm run dev:secure

# Windows PowerShell
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
npm run dev:secure
```

## Error Resolution

If you see errors like:
- `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`
- `APIConnectionError: Connection error`
- `unable to get local issuer certificate`

These indicate corporate firewall SSL interception. Use the solutions above.

## Security Note

Setting `NODE_TLS_REJECT_UNAUTHORIZED=0` disables SSL certificate verification. This is acceptable for development in corporate environments but should not be used in production.