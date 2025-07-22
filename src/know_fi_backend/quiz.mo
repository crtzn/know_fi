import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Error "mo:base/Error";


module {

/*
  =============================================================
  ENERGY CONTROLLER
  ========================================================
*/

// TODO Add function for reseting energy every 24 hours of the users.
public func getEnergy(energies:[(Principal, Int)], user: Principal, maxEnergy: Int) : Int {
  for((p, v) in energies.vals()){
    if(p == user) return v;
  };
  return maxEnergy;
};


/*
  =============================================================
  QUIZ CONTROLLER
  ========================================================
*/



/*
 - Need to create functio to get the categories of quiz choice of the users.
 - Functiion for compute the wins of the users
 - I am thingking here if ano ipapasa ko sa backend. For the quiz part,
 - the total wins token na lang kaya Ipasa ko sa backend,
 */


}



