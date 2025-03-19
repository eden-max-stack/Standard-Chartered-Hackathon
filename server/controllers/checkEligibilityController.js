const checkEligibility = async (req, res) => {
    try {
        console.log(req.body);

    const data = req.body;
    const age = data.data.age;
    const income = data.data.income;
    const loans = data.data.loans;
    console.log("age and income and loans are: ", age, income, loans);

    if (!(21 <= age <= 60)) {
        console.log("not elig");
        return res.json({ message: "you are not qualified for a loan", eligible: false});
    }

    if (income < 30000) {
        console.log("not elig");
        return res.json({ message: "you are not qualified for a loan", eligible: false});
    }

    const dtiRatio = (loans / income) * 100;
    if (dtiRatio > 50) {
        console.log("not elig");
        return res.json({ message: "you are not qualified for a loan", eligible: false});
    }

    if (dtiRatio < 40) {
        console.log("elig");
        return res.json({ message: "you are eligible for a loan", eligible: true});
    }

    return res.json({ message: "more information is required.", eligible: false});
    } catch (error) {
        console.error(error);
        return res.json({ message: error});
    }
}

module.exports = { checkEligibility };