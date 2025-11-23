module datava::core {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::event;
    use std::string::String;
    use sui::object::ID;

    /// Shared Pool object that manages contributions and reward distribution
    public struct Pool has key {
        id: UID,
        /// Total number of contributions
        total_contributions: u64,
        /// Total usage recorded
        total_usage: u64,
        /// Timestamp of creation
        created_at: u64,
    }

    /// Contribution object representing a dataset registered on-chain
    public struct Contribution has key {
        id: UID,
        /// Content identifier for the dataset in decentralized storage
        blob_cid: String,
        /// License type for the dataset
        license: String,
        /// Size of the dataset in bytes
        size: u64,
        /// Weight/importance factor
        weight: u64,
        /// Timestamp of contribution
        contributed_at: u64,
        /// Address of the contributor
        contributor: address,
        /// SEAL verification hash for authenticity
        seal_hash: String,
        /// Truth score (0-100) for dataset authenticity
        truth_score: u8,
    }

    /// Model artifact representing an AI model built with contributions
    public struct ModelArtifact has key {
        id: UID,
        /// Name of the model
        name: String,
        /// Description of the model
        description: String,
        /// Model version
        version: u64,
        /// Timestamp of publication
        published_at: u64,
        /// Creator address
        creator: address,
    }

    /// Event for when a contribution is made
    public struct EContributed has copy, drop {
        /// ID of the contribution
        contribution_id: ID,
        /// Content identifier
        blob_cid: String,
        /// Address of the contributor
        contributor: address,
        /// Pool ID
        pool_id: ID,
        /// Transaction timestamp
        timestamp: u64,
        /// SEAL verification hash
        seal_hash: String,
        /// Truth score
        truth_score: u8,
    }

    /// Event for when usage is recorded
    public struct EUsageRecorded has copy, drop {
        /// Pool ID
        pool_id: ID,
        /// Model version
        version: u64,
        /// Number of tokens processed
        tokens: u64,
        /// Fee paid for usage
        fee: u64,
        /// Requester address
        requester: address,
        /// Timestamp
        timestamp: u64,
    }

    /// Event for when a dataset is verified using SEAL
    public struct EDatasetVerified has copy, drop {
        /// ID of the contribution
        contribution_id: ID,
        /// Seal verification hash
        seal_hash: String,
        /// New truth score
        truth_score: u8,
        /// Address of the verifier
        verifier: address,
        /// Timestamp
        timestamp: u64,
    }

    /// Initialize a new pool for the marketplace
    public fun init_pool(ctx: &mut TxContext) {
        let pool = Pool {
            id: object::new(ctx),
            total_contributions: 0,
            total_usage: 0,
            created_at: 0, // Initialize to 0 since we can't get timestamp in init
        };

        transfer::transfer(pool, ctx.sender());
    }

    /// Create a new pool with initial parameters
    public fun create_pool(ctx: &mut TxContext) {
        init_pool(ctx);
    }

    /// Contribute a dataset to the pool with Walrus storage reference and SEAL verification
    public fun contribute(
        pool: &mut Pool,
        blob_cid: String,
        license: String,
        size: u64,
        weight: u64,
        seal_hash: String,
        truth_score: u8,
        ctx: &mut TxContext
    ) {
        let contribution = Contribution {
            id: object::new(ctx),
            blob_cid,
            license,
            size,
            weight,
            contributed_at: ctx.epoch(),
            contributor: ctx.sender(),
            seal_hash,
            truth_score,
        };

        // Update pool statistics
        pool.total_contributions = pool.total_contributions + 1;

        // Emit event before transferring
        event::emit(EContributed {
            contribution_id: object::id(&contribution),
            blob_cid: copy contribution.blob_cid,
            contributor: ctx.sender(),
            pool_id: object::id(pool),
            timestamp: ctx.epoch(),
            seal_hash: copy contribution.seal_hash,
            truth_score: contribution.truth_score,
        });

        // Transfer the contribution object to the sender (contributor)
        transfer::transfer(contribution, ctx.sender());
    }

    /// Publish a model artifact to the marketplace
    public fun publish_model(
        pool: &mut Pool,
        name: String,
        description: String,
        ctx: &mut TxContext
    ) {
        let model_artifact = ModelArtifact {
            id: object::new(ctx),
            name,
            description,
            version: 1, // Start with version 1
            published_at: ctx.epoch(),
            creator: ctx.sender(),
        };

        // Transfer the model artifact object to the creator
        transfer::transfer(model_artifact, ctx.sender());
    }

    /// Record usage of the marketplace services for reward tracking
    public fun record_usage(
        pool: &mut Pool,
        version: u64,
        tokens: u64,
        fee: u64,
        ctx: &mut TxContext
    ) {
        // Update pool statistics
        pool.total_usage = pool.total_usage + 1;

        // Emit usage event
        event::emit(EUsageRecorded {
            pool_id: object::id(pool),
            version,
            tokens,
            fee,
            requester: ctx.sender(),
            timestamp: ctx.epoch(),
        });
    }

    /// Update the truth score of a contribution using SEAL verification
    public fun verify_contribution(
        contribution: &mut Contribution,
        new_seal_hash: String,
        new_truth_score: u8,
        _pool: &mut Pool,  // Renamed with underscore to indicate it's unused - needed for proper object borrowing
        ctx: &mut TxContext
    ) {
        // Update the contribution with new verification data
        contribution.seal_hash = new_seal_hash;
        contribution.truth_score = new_truth_score;

        // Emit verification event
        event::emit(EDatasetVerified {
            contribution_id: object::id(contribution),
            seal_hash: copy contribution.seal_hash,
            truth_score: contribution.truth_score,
            verifier: ctx.sender(),
            timestamp: ctx.epoch(),
        });
    }

    /// Get the total number of contributions in the pool
    public fun get_total_contributions(pool: &Pool): u64 {
        pool.total_contributions
    }

    /// Get the total usage recorded in the pool
    public fun get_total_usage(pool: &Pool): u64 {
        pool.total_usage
    }

    /// Get the truth score of a contribution
    public fun get_truth_score(contribution: &Contribution): u8 {
        contribution.truth_score
    }

    /// Get the seal hash of a contribution
    public fun get_seal_hash(contribution: &Contribution): String {
        copy contribution.seal_hash
    }
}