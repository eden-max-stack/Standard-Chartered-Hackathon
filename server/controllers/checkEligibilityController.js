const checkEligibility = async (req, res) => {
    try {
        console.log(req.body);

    const data = req.body;
    console.log("age and income are: ", data.data.age, data.data.income);

    if (!(21 <= data.age <= 60)) {
        console.log("not elig");
        return res.json({ message: "you are not qualified for a loan"});
    }

    if (data.income < 30000) {
        console.log("not elig");
        return res.json({ message: "you are not qualified for a loan"});
    }

    // const dtiRatio = (existing_loans / data.income) * 100;
    // if (dtiRatio > 50) {
    //     console.log("not elig");
    //     return res.json({ message: "you are not qualified for a loan"});
    // }

    // if (dtiRatio < 40) {
    //     console.log("elig");
    //     return res.json({ message: "you are eligible for a loan"});
    // }

    return res.json({ message: "more information is required."});
    } catch (error) {
        console.error(error);
        return res.json({ message: error});
    }
}

module.exports = { checkEligibility };