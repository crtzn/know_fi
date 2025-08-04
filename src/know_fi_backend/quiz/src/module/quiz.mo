import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Text "mo:base/Text";
import AssocList "mo:base/AssocList";


module {

// TODO Add function for reseting energy every 24 hours of the users.
public func getEnergy(energies:[(Principal, Int)], user: Principal, maxEnergy: Int) : Int {
  for((p, v) in energies.vals()){
    if(p == user) return v;
  };
  return maxEnergy;
};


 public func setUsersQuizCategories(
    users: AssocList.AssocList<Principal, [Text]>,
    caller: Principal,
    categories: [Text]
  ): AssocList.AssocList<Principal, [Text]> {
    AssocList.replace(users, caller, Principal.equal, ?categories).0
  };

    public func getUserQuizCategories(
    users: AssocList.AssocList<Principal, [Text]>,
    caller: Principal
  ): ?[Text] {
    AssocList.find(users, caller, Principal.equal)
  };


}



