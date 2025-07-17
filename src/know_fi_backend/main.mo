
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HM "mo:base/HashMap";
import Error "mo:base/Error";
import { recurringTimer } = "mo:base/Timer";

import Energy "./quiz"

actor {

  let userCategories = HM.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);
  let maxEnergy = 25; // max energy for the user
  var energies = HM.HashMap<Principal, Int>(0, Principal.equal, Principal.hash);


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
   private func resetEnergyTimer() : async () {
    Energy.resetAllEnergy(energies, maxEnergy);
 };
 ignore recurringTimer(#seconds (24 * 60 * 60), resetEnergyTimer);



 public shared({caller}) func getEnergy() : async Int {
  switch(energies.get(caller)){
    case(null){
      energies.put(caller, maxEnergy);
      maxEnergy
    };
    case(?energy) energy;
  }
 }





}