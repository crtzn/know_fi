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

persistent actor Quiz {
    private  var users: AssocList.AssocList<Principal, [Text]> = List.nil();
    private  var energies : [(Principal, Int)] = [];
    let maxEnergy = 25;

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
        let currentEnergy = QuizModule.getEnergy(energies, caller, maxEnergy);
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

    public shared({caller}) func getCategories(): async ?[Text] {
        return QuizModule.getUserQuizCategories(users, caller)
    };

    public shared({caller}) func getEnergy() : async Int {
        QuizModule.getEnergy(energies, caller, maxEnergy);
    };

    private func resetAllUserEnergy() : async () {
        energies := Array.map<(Principal, Int), (Principal, Int)>(
            energies,
            func((p, _)) {
            let setMaxEnegry = (p, maxEnergy);
            return setMaxEnegry;
            }
        );
    };
    let _energyResetTimer = Timer.recurringTimer(#seconds 86_400, resetAllUserEnergy);
}