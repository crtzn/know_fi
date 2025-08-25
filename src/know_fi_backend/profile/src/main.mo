import ProfileModule "module/profile";
import Trie "mo:base/Trie";

import ProfileType "./types/profile_types";

persistent actor class Profile () {
    private var profiles = Trie.empty<Principal, ProfileType.Profile>();


    public shared ({ caller }) func setProfile (profile: ProfileType.Profile) : async () {
     profiles := ProfileModule.setProfile(profiles, caller, profile);
    };

    public shared ({ caller }) func updateProfile (name: ?Text, userName: ?Text, bio: ?Text, github: ?Text, twitter: ?Text, linkedin: ?Text) : async () {
        profiles := ProfileModule.updateProfile(profiles, caller, name, userName, bio, github, twitter, linkedin);
    };

    public shared ({ caller }) func getProfile () : async ?ProfileType.Profile {
        ProfileModule.getProfile(profiles, caller);
    };

    public shared query func getProfileByPrincipal(userId: Principal) : async ?ProfileType.Profile {
        ProfileModule.getProfile(profiles, userId);
    };

    public shared({ caller }) func getPrincipal() : async Principal {
    return caller;
    }
}