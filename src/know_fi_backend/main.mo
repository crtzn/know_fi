
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HM "mo:base/HashMap";
import Error "mo:base/Error";
import { recurringTimer } = "mo:base/Timer";
import Int "mo:base/Int";
import AssocList "mo:base/AssocList";
import List "mo:base/List";

import Energy "./quiz"

actor {

  let userCategories = HM.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);
  let maxEnergy = 25; // max energy for the user
  private stable var energies : [(Principal, Int)] = [];
  private stable var users: AssocList.AssocList<Principal, [Text]> = List.nil();

// set categories of the users
  public shared({caller}) func setCategories(categories: [Text]) : async () {
 if(categories.size() == 0) {
  throw Error.reject("No categories selected!");
 };
 userCategories.put(caller, categories);
  };

  public shared({caller}) func getCategories(): async ?[Text] {
    return userCategories.get(caller);
  };


  /*
  =============================================================
  QUIZ && ENERGY FUNCTIONS
  ========================================================
  */


    // reset energy every 24 hours
  //    private func resetEnergyTimer() : async () {
  //     Energy.resetAllEnergy(energies, maxEnergy);
  //  };
  //  ignore recurringTimer(#seconds (24 * 60 * 60), resetEnergyTimer);

 public shared({caller}) func getEnergy() : async Int {
  Energy.getEnergy(energies, caller, maxEnergy);
 };


/*
  =============================================================
  QUIZ PART
  ========================================================
*/


public shared({caller}) func setUsersQuizCategories(categories: [Text]) : async () {
 if(categories.size() == 0) {
  throw Error.reject("No categories selected!")
 };
 users := AssocList.replace(users, caller, func(a: Principal, b: Principal) : Bool { a == b }, ?categories).0;
};

public shared({caller}) func getUserQuizCategories() : async ?[Text] {
  AssocList.find(users, caller, func(a: Principal, b: Principal) : Bool { a == b });
}





}