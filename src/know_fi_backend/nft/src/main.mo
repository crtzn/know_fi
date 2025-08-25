// KnowFi NFT Canister - ICRC-7 Implementation for Educational Achievement NFTs
// This canister handles minting and managing NFTs for course completions

// Base Motoko libraries
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Vec "mo:vector";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import D "mo:base/Debug";
import CertifiedData "mo:base/CertifiedData";

// ICRC standards
import ICRC7 "mo:icrc7-mo";
import ICRC37 "mo:icrc37-mo";
import ICRC3 "mo:icrc3-mo";

import ICRC7Default "./initial_state/icrc7";
import ICRC37Default "./initial_state/icrc37";
import ICRC3Default "./initial_state/icrc3";

// Class management
import ClassPlus "mo:class-plus";

// Actor class definition - this is where your NFT canister starts
shared(_init_msg) actor class KnowFiNFT(_args : {
  icrc7_args: ?ICRC7.InitArgList;
  icrc37_args: ?ICRC37.InitArgList;
  icrc3_args: ICRC3.InitArgs;
}) = this {

  // Type aliases to make code more readable
  type Account = ICRC7.Account;
  type Environment = ICRC7.Environment;
  type Value = ICRC7.Value;
  type NFT = ICRC7.NFT;
  type TransferArgs = ICRC7.Service.TransferArg;
  type TransferResult = ICRC7.Service.TransferResult;
  type TransferError = ICRC7.Service.TransferError;

  // Store initialization message
  stable var init_msg = _init_msg;
  stable var original_args = _args;

  D.print("KnowFi NFT Canister initializing with args: " # debug_show(_args));


  private stable var nextTokenId : Nat = 0;
  private stable var nfts : [(Nat, {owner: Principal; metadata: [(Text, Value)]})] = [];

  // === QUERY FUNCTIONS ===

  // Placeholder for basic functionality - we'll build this step by step
  public query func getName() : async Text {
    return "KnowFi Achievement NFTs";
  };

  // Get total supply of minted NFTs
  public query func getTotalSupply() : async Nat {
    return nfts.size();
  };

  // Get all NFTs (for testing)
  public query func getAllNFTs() : async [(Nat, {owner: Principal; metadata: [(Text, Value)]})] {
    return nfts;
  };

  // Get NFTs owned by a specific user
  public query func getNFTsOfUser(user: Principal) : async [Nat] {
    let userNFTs = Array.mapFilter<(Nat, {owner: Principal; metadata: [(Text, Value)]}), Nat>(
      nfts,
      func(entry) {
        if (entry.1.owner == user) { ?entry.0 } else { null }
      }
    );
    return userNFTs;
  };

  public shared({caller}) func myNFTs() : async [(Nat, {owner: Principal; metadata: [(Text, Value)]})] {
    return nfts;
  };

  // === MINTING FUNCTIONS ===

  public shared({caller}) func mintCourseCompletionCertificate(courseName: Text) : async Nat {
    let tokenId = nextTokenId;
    nextTokenId += 1;

    let metadata = [
      ("name", #Text("Course Completion: " # courseName)),
      ("description", #Text("Certificate of completion for " # courseName # " course")),
      ("course_name", #Text(courseName)),
      ("completion_date", #Nat(Int.abs(Time.now()))),
      ("certificate_type", #Text("course_completion")),
      ("student", #Text(Principal.toText(caller))),
      ("issued_by", #Text("KnowFi")),
      // ("image", #Text("https://knowfi.com/certificates/" # courseId # ".png")),
      ("image", #Text("https://mksruxayrhhomka4lynqig33l3itkcqly3wzpqunnz3fwrhdpkda.arweave.net/YqUaXBiJzuYoHF4bBBt7XtE1CgvG7ZfCjW52W0TjeoY")),
    ];

    let nftEntry = (tokenId, {
      owner = caller;
      metadata = metadata;
    });

    nfts := Array.append(nfts, [nftEntry]);

    D.print("✅ Successfully minted certificate #" # Nat.toText(tokenId) # " for " # Principal.toText(caller));

    return tokenId;
  };
}
