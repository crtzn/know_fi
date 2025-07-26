
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HM "mo:base/HashMap";
import Error "mo:base/Error";
import { recurringTimer } = "mo:base/Timer";
import Int "mo:base/Int";
import AssocList "mo:base/AssocList";
import List "mo:base/List";
import Array "mo:base/Array";
import Debug "mo:base/Debug";


import Quiz "./module/quiz";

actor {


  private stable var userCategories: AssocList.AssocList<Principal, [Text]> = List.nil();
  let maxEnergy = 25; // max energy for the new user
  private stable var virtualTokens: [(Principal, Int)] = [];
  private stable var energies : [(Principal, Int)] = [];
  private stable var users: AssocList.AssocList<Principal, [Text]> = List.nil();

// set categories of the users
  public shared({caller}) func setCategories(categories: [Text]) : async () {
    if(categories.size() == 0) {
      throw Error.reject("No categories selected!");
    };
   users := Quiz.setUsersQuizCategories(users, caller, categories)
  };

  public shared({caller}) func getCategories(): async ?[Text] {
    return Quiz.getUserQuizCategories(users, caller)
  };

 public shared({caller}) func getEnergy() : async Int {
  Quiz.getEnergy(energies, caller, maxEnergy);
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
};

public shared({caller}) func userTakeTheQuiz() : async () {

  let currentEnergy = Quiz.getEnergy(energies, caller, maxEnergy);

  // checking if the user has enough energry
  if(currentEnergy <= 0 ) {
    throw Error.reject("Not enough Energy to take the quiz")
  };

  //else
  let newEnergy = currentEnergy - 1;
  //update this energies : [(Principal, Int)] = [];
   energies := Array.filter<(Principal, Int)>(energies, func (entry) {entry.0 != caller});
   energies := Array.append(energies, [(caller, newEnergy)]);
   Debug.print(debug_show(energies));
};





}