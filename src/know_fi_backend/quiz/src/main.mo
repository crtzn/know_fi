import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Int "mo:base/Int";
import AssocList "mo:base/AssocList";
import List "mo:base/List";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Timer "mo:base/Timer";

import QuizModule "./module/quiz";


persistent actor class Quiz () {
    private var users: AssocList.AssocList<Principal, [Text]> = List.nil();
    private var energies : [(Principal, Int)] = [];
    private var virtual_token : [(Principal, Int)] = []; //for the mvp, we use virtual token. But soon integrate this to real token!
    private var _userCategories: AssocList.AssocList<Principal, [Text]> = List.nil();
    let max_energy = 25;

    type QuizLevel = {
    #easy;
    #medium;
    #hard;
    #extreme;
    };

    type UserAnswer = {
    level: QuizLevel;
    isCorrect: Bool;
    };

  public shared({caller}) func setCategories(categories: [Text]) : async () {
       if(categories.size() == 0) {
      throw Error.reject("No categories selected!");
    };
     users := QuizModule.setUsersQuizCategories(users, caller, categories)
  };

    public shared({caller}) func setUsersQuizCategories(categories: [Text]) : async () {
        if(categories.size() == 0) {
            throw Error.reject("No categories selected!")
    };
        users := AssocList.replace(users, caller, func(a: Principal, b: Principal) : Bool { a == b }, ?categories).0;
    };

    public shared({caller}) func getUserQuizCategories() : async ?[Text] {
        AssocList.find(users, caller, func(a: Principal, b: Principal) : Bool { a == b });
    };

    public shared({caller}) func getCategories(): async ?[Text] {
        return QuizModule.getUserQuizCategories(users, caller)
    };

    public shared({caller}) func getEnergy() : async Int {
        QuizModule.getEnergy(energies, caller, max_energy);
    };

    private func resetAllUserEnergy() : async () {
        energies := Array.map<(Principal, Int), (Principal, Int)>(
            energies,
            func((p, _)) {
            let setMaxEnegry = (p, max_energy);
            return setMaxEnegry;
            }
        );
    };
    let _energyResetTimer = Timer.recurringTimer(#seconds 86_400, resetAllUserEnergy);


    /*
    In this part logic, trying to manipulate the quiz part, where user token is functionable.
    */

     public shared({caller}) func userTakeTheQuiz() : async () {
        let currentEnergy = QuizModule.getEnergy(energies, caller, max_energy);
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

    func updateTokens(user:Principal, reward: Int) {
        let currentBalance = switch (Array.find<(Principal, Int)>(virtual_token, func (entry) { entry.0 == user })) {
        case null { 0 };
        case (?entry) { entry.1 };
        };
        virtual_token := Array.filter<(Principal, Int)>(virtual_token, func(p) {p.0 != user});
        let newBalance = currentBalance + reward;
        virtual_token := Array.append(virtual_token, [(user, newBalance)]);
    };

    public shared({caller}) func submitQuiz(answer: [UserAnswer]) : async Int {
         let currentEnergy = QuizModule.getEnergy(energies, caller, max_energy);
         if(currentEnergy <= 0) {
            throw Error.reject("Not enough energy to take the quiz!");
         };
         // calculate the users rewards for taking quiz
         var totalReward: Int = 0;
         for(ans in answer.vals()) {
            if(ans.isCorrect) {
                totalReward += switch (ans.level) {
                    case (#easy) 5;
                    case (#medium) 15;
                    case (#hard) 25;
                    case (#extreme) 45;
                }
            }
         };

        let newEnergy = currentEnergy - 1;
            //update this energies : [(Principal, Int)] = [];
            energies := Array.filter<(Principal, Int)>(energies, func (entry) {entry.0 != caller});
            energies := Array.append(energies, [(caller, newEnergy)]);
            Debug.print(debug_show(energies));

        // update the user virtual tokens
        updateTokens(caller, totalReward);

        Debug.print(Int.toText(totalReward));
        return totalReward
    };

  public shared({caller}) func getMyTokenBalance() : async Int {
    switch (Array.find<(Principal, Int)>(virtual_token, func (p) { p.0 == caller })) {
      case null { 0 };
      case (?entry) { entry.1 };
    }
  };

    public func addTokenReward(user: Principal, reward: Int) : async () {
        updateTokens(user, reward);
    };

}