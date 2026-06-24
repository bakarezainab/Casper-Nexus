#![no_std]
#![no_main]

use odra::prelude::*;
use odra::types::Address;

#[odra::module]
pub struct CasperNexusAsset {
    owner: Var<Address>,
    metadata_hash: Var<String>,
}

#[odra::module]
impl CasperNexusAsset {
    #[odra(init)]
    pub fn init(&mut self, metadata_hash: String) {
        self.owner.set(self.env().caller());
        self.metadata_hash.set(metadata_hash);
        
        self.env().emit_event(AssetRegistered {
            owner: self.env().caller(),
            hash: metadata_hash,
        });
    }

    pub fn get_owner(&self) -> Address {
        self.owner.get_or_default()
    }

    pub fn get_metadata_hash(&self) -> String {
        self.metadata_hash.get_or_default()
    }
}

#[derive(Event, PartialEq, Eq, Debug)]
pub struct AssetRegistered {
    pub owner: Address,
    pub hash: String,
}
