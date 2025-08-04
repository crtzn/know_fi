import ProfileType "../types/profile_types";
import Trie "mo:base/Trie";
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Text "mo:base/Text";



module {

    public func setProfile(profiles: Trie.Trie<Principal, ProfileType.Profile>, caller: Principal, profile:ProfileType.Profile) : Trie.Trie<Principal, ProfileType.Profile> {
        // type Key<K> = { hash : Hash.Hash; key : K }
        let key = { hash = Principal.hash(caller); key = caller };
        //func put<K, V>(t : Trie<K, V>, k : Key<K>, k_eq : (K, K) -> Bool, v : V) : (Trie<K, V>, ?V)
        let (newProfiles, _) = Trie.put(profiles, key, Principal.equal, profile);
        newProfiles
    };

 public func updateProfile(
    profiles: Trie.Trie<Principal, ProfileType.Profile>,
    caller: Principal,
    userName: ?Text,
    bio: ?Text,
    github: ?Text,
    linkedin: ?Text,
    twitter: ?Text
) : Trie.Trie<Principal, ProfileType.Profile> {
    let key = { hash = Principal.hash(caller); key = caller };
    let existingProfile = Trie.get(profiles, key, Principal.equal);

    switch (existingProfile) {
        case null {
            profiles
        };
        case (?profile) {
            let updatedProfile : ProfileType.Profile = {
                userName = Option.get<Text>(userName, profile.userName);
                bio = Option.get<Text>(bio, profile.bio);
                github = Option.get<Text>(github, profile.github);
                linkedin = Option.get<Text>(linkedin, profile.linkedin);
                twitter = Option.get<Text>(twitter, profile.twitter);
            };
            Trie.put(profiles, key, Principal.equal, updatedProfile).0
        };
    }
};


    public func getProfile(profiles: Trie.Trie<Principal, ProfileType.Profile>, caller: Principal) : ?ProfileType.Profile {
        let key = { hash = Principal.hash(caller); key = caller};
        Trie.get(profiles, key, Principal.equal);
    };

}