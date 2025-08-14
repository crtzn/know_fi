import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Profile "canister:profile";
import ProfileType "../profile/src/types/profile_types";
import Time "mo:base/Time";
import Array "mo:base/Array";

actor class Forum () {
    type Post = {
        id: Nat;
        authorId: Principal;
        // authorName: Text; -> Need to fix this to get profile in the profile canister
        title: Text;
        content: Text;
        timestamp: Int;
        response: [Response];
    };

    type Response = {
        id: Nat;
        authorId: Principal;
        //authorName: Text; -> Need to fix this to get profile in the profile canister
        content: Text;
        timestamp: Int;
        approved: Bool;
    };

    stable var posts: [Post] = [];
    stable var postId: Nat = 0;
    stable var responseId: Nat = 0;

    public query func getAllPosts() : async [Post] {
        return posts;
    };

    public shared(msg) func createPost(title: Text, content: Text) : async Nat {
        let caller = msg.caller;

        let newPost : Post = {
            id = postId;
            authorId = caller;
            title = title;
            content = content;
            timestamp = Time.now();
            response = [];
        };

        posts := Array.append(posts, [newPost]);
        let currentId = postId;
        postId += 1;
        return currentId;
    };
}