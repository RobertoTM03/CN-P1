#!/bin/bash

# Script para obtener el valor de una API Key de AWS API Gateway
# Uso: ./get-api-key.sh API_KEY_ID [REGION]

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar que se pasó el API Key ID
if [ -z "$1" ]; then
    echo -e "${RED}Error: Debes proporcionar el API Key ID${NC}"
    echo ""
    echo "Uso: $0 API_KEY_ID [REGION]"
    echo ""
    echo "Ejemplo:"
    echo "  $0 u3xo14smq2"
    echo "  $0 u3xo14smq2 us-east-1"
    exit 1
fi

API_KEY_ID="$1"
REGION="${2:-us-east-1}"

echo -e "${YELLOW}Obteniendo API Key...${NC}"
echo "API Key ID: $API_KEY_ID"
echo "Región: $REGION"
echo ""

# Obtener el valor de la API Key
API_KEY_VALUE=$(aws apigateway get-api-key \
    --api-key "$API_KEY_ID" \
    --include-value \
    --region "$REGION" \
    --query "value" \
    --output text 2>&1)

# Verificar si hubo error
if [ $? -ne 0 ]; then
    echo -e "${RED}Error al obtener la API Key:${NC}"
    echo "$API_KEY_VALUE"
    exit 1
fi

# Mostrar el resultado
echo -e "${GREEN}✅ API Key obtenida exitosamente:${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}API Key Value:${NC} $API_KEY_VALUE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Úsala en tus requests con el header:"
echo "  -H \"x-api-key: $API_KEY_VALUE\""
