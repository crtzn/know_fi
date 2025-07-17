import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Option "mo:base/Option";

/*
    - so here i will focus for storing, validating, and managing quiz data
    - Track quiz user take, then scores
    - manage user rewards for completing the quizzes
    - compute the wins, then rewards them token
    - manage the user energies
 */

module {

public func resetAllEnergy((energies: HashMap.HashMap<Principal, Int>, maxEnergy: Int)) {

    for((user, _energy) in energies.entries()) {
        energies.put(user, maxEnergy);
    }
};

public func getEnergy((energies: HashMap.HashMap<Principal, Int>, user:Principal)) : Int {
    Option.get(energies.get(user), 0);
}

}