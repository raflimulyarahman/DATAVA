#!/bin/bash

# DATAVA Contract Deployment Script
# Deploys the smart contracts to the Sui network

set -e # Exit on any error

echo "🚀 Deploying DATAVA smart contracts..."

# Get the root directory of the project
PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$PROJECT_ROOT/contracts"

echo "📦 Building contracts..."
sui move build

echo "🔗 Deploying to Sui devnet..."
DEPLOY_OUTPUT=$(sui client publish --gas-budget 50000 --json)

# Extract the package ID from the deployment output
PACKAGE_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.objectChanges[] | select(.type == "published") | .packageId')
echo "✅ Contract deployed successfully! Package ID: $PACKAGE_ID"

# Create a new pool object
echo "🏦 Creating initial pool..."
CREATE_POOL_TX=$(sui client call --package "$PACKAGE_ID" --module "core" --function "create_pool" --gas-budget 20000 --json)
POOL_ID=$(echo "$CREATE_POOL_TX" | jq -r '.objectChanges[] | select(.type == "created") | select(.objectType | contains("::core::Pool")) | .objectId')

if [ "$POOL_ID" = "null" ] || [ -z "$POOL_ID" ]; then
    # Try to get the pool ID from events instead if direct method doesn't work
    POOL_ID=$(echo "$CREATE_POOL_TX" | jq -r '.objectChanges[] | select(.objectType | contains("::core::Pool")) | .objectId' 2>/dev/null || echo "")
    if [ -z "$POOL_ID" ]; then
        # Fallback: get the pool ID from the transaction effects
        POOL_ID=$(echo "$CREATE_POOL_TX" | jq -r '.effects.created[] | select(.owner | type == "object" and .AddressOwner) | .reference.objectId' 2>/dev/null | head -n 1 || echo "")
    fi
fi

if [ -z "$POOL_ID" ] || [ "$POOL_ID" = "null" ]; then
    echo "⚠️ Could not determine pool ID from transaction, need to find it manually"
    # In a real scenario, we might need to query for the newly created object
    POOL_ID="MANUAL_LOOKUP_NEEDED"
fi

echo "✅ Pool created! Pool ID: $POOL_ID"

# Update the .env file in the web app with the new addresses
ENV_FILE="$PROJECT_ROOT/apps/web/.env.local"

echo "📝 Updating environment variables..."
if [ -f "$ENV_FILE" ]; then
    # Update existing .env.local file
    sed -i "s/NEXT_PUBLIC_PACKAGE_ID=.*/NEXT_PUBLIC_PACKAGE_ID=$PACKAGE_ID/" "$ENV_FILE"
    sed -i "s/NEXT_PUBLIC_POOL_ID=.*/NEXT_PUBLIC_POOL_ID=$POOL_ID/" "$ENV_FILE"
else
    # Create new .env.local file
    cat > "$ENV_FILE" << EOF
NEXT_PUBLIC_PACKAGE_ID=$PACKAGE_ID
NEXT_PUBLIC_POOL_ID=$POOL_ID
NEXT_PUBLIC_WALRUS_RELAY=http://localhost:5051
NEXT_PUBLIC_INFERENCE_URL=http://localhost:5052
EOF
fi

# Also update the .env file if it exists
if [ -f "$PROJECT_ROOT/apps/web/.env" ]; then
    sed -i "s/NEXT_PUBLIC_PACKAGE_ID=.*/NEXT_PUBLIC_PACKAGE_ID=$PACKAGE_ID/" "$PROJECT_ROOT/apps/web/.env"
    sed -i "s/NEXT_PUBLIC_POOL_ID=.*/NEXT_PUBLIC_POOL_ID=$POOL_ID/" "$PROJECT_ROOT/apps/web/.env"
fi

echo "✅ Environment variables updated!"

echo "🎉 Deployment complete!"
echo "📦 Package ID: $PACKAGE_ID"
echo "🏦 Pool ID: $POOL_ID"
echo ""
echo "💡 Next steps:"
echo "   1. Verify the deployment: sui client object --id $PACKAGE_ID"
echo "   2. Verify the pool: sui client object --id $POOL_ID"
echo "   3. Start the services with: ./scripts/dev.sh"