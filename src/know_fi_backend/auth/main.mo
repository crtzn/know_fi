import Principal "mo:base/Principal";
persistent actor {
    public shared(msg) func whoami () : async Principal {
        msg.caller
    };
}