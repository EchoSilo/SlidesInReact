@echo off
rem Batch script to run dev server with TLS workaround for corporate networks
set NODE_TLS_REJECT_UNAUTHORIZED=0
npm run dev:secure