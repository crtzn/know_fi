import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";

persistent actor Auth {
    type Role = {
        #owner;
        #admin;
    };
    // Store users and their roles
    private var ownerInitialized : Bool = false;
    private transient var userRoles = HashMap.HashMap<Principal, Role>(0, Principal.equal, Principal.hash);

    public shared(msg) func initializeOwner() : async Result.Result<Text, Text> {
        if (ownerInitialized) {
            return #err("Owner already initialized");
        };

        userRoles.put(msg.caller, #owner);
        ownerInitialized := true;
        return #ok("Owner initialized successfully");
    };

    //assign role to the users.
    public shared(msg) func assignRole(user: Principal, role: Role) : async Result.Result<Text, Text> {
        switch (userRoles.get(msg.caller)) {
            case (?#owner) {
                // Owner can assign any role
                userRoles.put(user, role);
                return #ok("Role assigned successfully");
            };
            case (?#admin) {
                // Admin can only assign admin role, not owner
                switch (role) {
                    case (#admin) {
                        userRoles.put(user, role);
                        return #ok("Admin role assigned successfully");
                    };
                    case (#owner) {
                        return #err("Admins cannot assign owner role");
                    };
                };
            };
            case (null) {
                return #err("Unauthorized: Only owner or admin can assign roles");
            };
        };
    };

    //checking if the user has a specific role
    public query func hasRole(user: Principal, roleToCheck: Role) : async Bool {
        switch (userRoles.get(user)) {
            case (?role) {
                return role == roleToCheck;
            };
            case (null) {
                return false;
            };
        };
    };

    public query func isOwner(user: Principal) : async Bool {
        switch (userRoles.get(user)) {
            case (?#owner) {
                true
            };
            case (_) { false };
        };
    };

    public shared(msg) func whoami() : async Principal {
        msg.caller
    };

    // get caller's role
    public shared(msg) func myRole() : async ?Role {
        userRoles.get(msg.caller);
    };

     public shared(msg) func listAdminsAndOwners() : async Result.Result<[(Principal, Role)], Text> {
        switch (userRoles.get(msg.caller)) {
            case (?#owner or ?#admin) {
                let users = Buffer.Buffer<(Principal, Role)>(0);
                for ((user, role) in userRoles.entries()) {
                    users.add((user, role));
                };
                return #ok(Buffer.toArray(users));
            };
            case (_) {
                return #err("Unauthorized");
            };
        };
    };
}