import Quiz "canister:quiz";

persistent actor Quests {
    type QuestData = {
        content: Text;
        url: Text;
    };



    public shared({caller}) func completeQuest() : async Bool {

        // rightnow the quest is hard coded muna sa frontend, then the this function will trigger to frontend
        // once the quest is done. distribute the reward:>
        let rewardAmount = 10;
        await Quiz.addTokenReward(caller, rewardAmount);

        return true;
    };

    public shared({caller}) func dailyClaim() : async Bool {

        /*
        -> now sa frontend ko na handle yung reset of daily claim
        -> Then this function will trigger every click
        */

        let dailyRewardAmount = 5;
        await Quiz.addTokenReward(caller, dailyRewardAmount);

        return true;
    };


    public shared({caller}) func referralFriend() : async () {
        let referralReward = 5;

        await Quiz.addTokenReward(caller, referralReward);

    };
}