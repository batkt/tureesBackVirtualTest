async function khuudaslalt(model, body) {
    const { query = {}, order, khuudasniiDugaar = 1, khuudasniiKhemjee = 10, search } = body
    if (!!search)
        query['$text'] = { $search: search }
    let jagsaalt = await model.find(query).sort(order).skip((khuudasniiDugaar - 1) * khuudasniiKhemjee)
        .limit(khuudasniiKhemjee).catch((err) => {
            console.log(err)
        });
    let niitMur = await model.countDocuments(query);
    let niitKhuudas = (niitMur % khuudasniiKhemjee) == 0 ? Math.floor(niitMur / khuudasniiKhemjee) : Math.floor(niitMur / khuudasniiKhemjee) + 1;
    jagsaalt.forEach(mur => mur.key = mur._id)
    return {
        khuudasniiDugaar,
        khuudasniiKhemjee,
        jagsaalt,
        niitMur,
        niitKhuudas
    }
}

module.exports = khuudaslalt