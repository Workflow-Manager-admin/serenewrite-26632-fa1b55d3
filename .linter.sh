#!/bin/bash
cd /home/kavia/workspace/code-generation/serenewrite-26632-fa1b55d3/serenewrite
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

