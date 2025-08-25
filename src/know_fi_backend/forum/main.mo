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
        authorName: Text;
        title: Text;
        content: Text;
        timestamp: Int;
        response: [Response];
    };

    type Response = {
        id: Nat;
        authorId: Principal;
        authorName: Text;
        content: Text;
        timestamp: Int;
        // approved: Bool;
    };

    stable var posts: [Post] = [];
    stable var postId: Nat = 0;
    stable var response: [Response] = [];
    stable var responseId: Nat = 0;

    public query func getAllPosts() : async [Post] {
        return posts;
    };

   public shared(msg) func createPost(title: Text, content: Text) : async Nat {
    let caller = msg.caller;
    let profileOpt = await Profile.getProfileByPrincipal(caller);

    let authorName = switch (profileOpt) {
        case (?profile) { profile.name };
        case null { "Unknown" };
    };

    let newPost : Post = {
        id = postId;
        authorId = caller;
        authorName = authorName;
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

    public shared(msg) func comment(postId: Nat, content: Text) : async Nat{
        let caller = msg.caller;
            let profileOpt = await Profile.getProfileByPrincipal(caller);

        let authorName = switch (profileOpt) {
            case (?profile) { profile.name };
            case null { "Unknown" };
        };

        let newResponse : Response = {
            id = responseId;
            authorId = caller;
            authorName = authorName;
            content = content;
            timestamp = Time.now();
            // approved:
        };

        // Find the post by postId and add the new response to its response array
        var updatedPosts = Array.map<Post, Post>(posts, func(post) {
            if (post.id == postId) {
            // Add the new response to the post's response array
            let updatedResponses = Array.append(post.response, [newResponse]);
            { post with response = updatedResponses }
            } else {
            post
            }
        });
        posts := updatedPosts;
        let currentId = responseId;
        responseId += 1;
        return currentId;
    };
}