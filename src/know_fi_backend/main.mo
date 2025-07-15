
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HM "mo:base/HashMap";
import Error "mo:base/Error";

actor {
  let userCategories = HM.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);

// set categories of the users
  public shared({caller}) func setCategories(categories: [Text]) : async () {
 if(categories.size() == 0) {
  throw Error.reject("No categories selected!");
 };
 userCategories.put(caller, categories);
  };

  public shared({caller}) func getCategories(): async ?[Text] {
    return userCategories.get(caller);
  }


}