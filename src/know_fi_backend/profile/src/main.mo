import ProfileModule "module/profile";
import Trie "mo:base/Trie";

//Types
import ProfileType "./types/profile_types";

persistent actor Profile {
    private var profiles = Trie.empty<Principal, ProfileType.Profile>();


    public shared ({ caller }) func setProfile (profile: ProfileType.Profile) : async () {
     profiles := ProfileModule.setProfile(profiles, caller, profile);
    };

    public shared ({ caller }) func updateProfile (userName: ?Text, bio: ?Text, github: ?Text, twitter: ?Text, linkedin: ?Text) : async () {
        profiles := ProfileModule.updateProfile(profiles, caller, userName, bio, github, twitter, linkedin);
    };

    public shared ({ caller }) func getProfile () : async ?ProfileType.Profile {
        ProfileModule.getProfile(profiles, caller);
    };
}