const ZassanBarimt = require("../models/zassanBarimt");
const lodash = require("lodash");

async function zassanBarimtShalgakh(oldData, newData, dugaar, classType, className, body)
{
    if(!!oldData && !!newData)
    {
        const uurchlult = [];
        for (const [key, value] of Object.entries(oldData._doc)) {
          var shineUtga = newData._doc[key]
          if(JSON.stringify(value) !== JSON.stringify(shineUtga))
          {
              var tempData = {
              talbar: key,
              talbarNer: orchuulyaText(key),
              umnukhUtga: lodash.isArray(value) ? arrayUtgaUurchlukh(key, value) : value,
              shineUtga: lodash.isArray(shineUtga) ? arrayUtgaUurchlukh(key, shineUtga) : shineUtga,
              utganiiTurul: lodash.isDate(shineUtga) ? "date" : typeof shineUtga,
              }
              uurchlult.push(tempData);
          }
        }
        for (const [key, value] of Object.entries(newData._doc)) {
          var temp = uurchlult.filter((a) => a.talbar === key);
          if(temp?.length === 0)
          {
              const umnukhUtga = oldData._doc[key]
              if(!!value && JSON.stringify(value) !== JSON.stringify(umnukhUtga))
              {
              var tempData = {
                  talbar: key,
                  talbarNer: orchuulyaText(key),
                  umnukhUtga: lodash.isArray(umnukhUtga) ? arrayUtgaUurchlukh(key, umnukhUtga) : umnukhUtga,
                  shineUtga: lodash.isArray(value) ? arrayUtgaUurchlukh(key, value) : value,
                  utganiiTurul: lodash.isDate(value) ? "date" : typeof value,
              }
              uurchlult.push(tempData);
              }
          }
        }
        if(!!uurchlult && uurchlult.length > 0)
        {
            var barimt = new ZassanBarimt(body.tukhainBaaziinKholbolt)();
            barimt.baiguullagiinId = oldData.baiguullagiinId;
            barimt.barilgiinId = oldData.barilgiinId;
            barimt.classId = oldData._id;
            barimt.classDugaar = dugaar;
            barimt.classOgnoo = oldData.createdAt;
            barimt.classType = classType;
            barimt.className = className;
            barimt.uurchlult = uurchlult;
            barimt.ajiltniiId = body.nevtersenAjiltniiToken.id;
            barimt.ajiltniiNer = body.nevtersenAjiltniiToken.ner;
            barimt.save(); 
        }
    }
}

function arrayUtgaUurchlukh(key, value){
    
    if(!!value && value?.length > 0 && ("utas" === key || "talbainIdnuud" === key || "tulukhUdur" === key))
    {
        var strValue = "";
        value.forEach(element => {
            strValue += (!strValue ? "" : ", ") + element;
        });           
        return strValue;
    }
    else
        return JSON.stringify(value)
}

function orchuulyaText(text){
  text = text.toString();
  var butsaakhText = "";
  switch (text) {
    case "kod":
      butsaakhText = "Код";
      break;
    case "sulKhemjee":
      butsaakhText = "Сул хэмжээ";
      break;
    case "tailbar":
      butsaakhText = "Тайлбар";
      break;
    case "barilgiinId":
      butsaakhText = "Барилгын №";
      break;
    case "zurgiinId":
      butsaakhText = "Зургийн №";
      break;
    case "ashiglaltiinZardal":
      butsaakhText = "Ашиглалтийн зардал";
      break;
    case "niitAshiglaltiinZardal":
      butsaakhText = "Нийт ашиглалтийн зардал";
      break;
    case "niitiinTalbaiEsekh":
      butsaakhText = "Нийт талбай эсэх";
      break;
    case "idevkhiteiEsekh":
      butsaakhText = "Идэвхтэй эсэх";
      break; 
    case "tureesiinTulbur":
      butsaakhText = "Түрээсийн төлбөр";
      break; 
    case "segmentuud":
        butsaakhText = "Сегментүүд";
        break; 
    case "khurunguud":
      butsaakhText = "Хөрөнгүүд";
      break; 
    case "bairshil":
      butsaakhText = "Байршил";
      break; 
    case "id":
      butsaakhText = "Дугаар";
      break;  
    case "gereeniiDugaar":
      butsaakhText = "Гэрээний дугаар дугаар";
      break;
    case "gereeniiOgnoo":
      butsaakhText = "Гэрээний огноо";  
      break;
    case "turul":
      butsaakhText = "Төрөл";
      break;
    case "ovog":
      butsaakhText = "Овог";
      break;
    case "ner":
      butsaakhText = "Нэр";    
      break;
    case "register":
      butsaakhText = "Регистер";
      break;
    case "customerTin":
      butsaakhText = "ТИН дугаар";
      break;
    case "albanTushaal":
      butsaakhText = "Албан тушаал";
      break;
    case "zakhirliinOvog":
      butsaakhText = "Захиралын овог";  
      break;
    case "zakhirliinNer":
      butsaakhText = "Захиралын нэр";
      break;
    case "utas":
      butsaakhText = "Утас";
      break;
    case "mail":
      butsaakhText = "И-Мэйл";
      break;
    case "khayag":
      butsaakhText = "Хаяг";    
      break;
    case "khugatsaa":
      butsaakhText = "Хугацаа";
      break;
    case "duusakhOgnoo":
      butsaakhText = "Дуусах огноо";
      break;
    case "tsutsalsanOgnoo":
      butsaakhText = "Цуцалсан огноо";
      break;
    case "khungulukhKhugatsaa":
      butsaakhText = "Хөнгөлөх хугацаа";  
      break;
    case "sariinTurees":
      butsaakhText = "Сарын түрээс";
      break;
    case "gerchilgeeniiZurag":
      butsaakhText = "Гэрчилгээний зураг";
      break;
    case "unemlekhniiZurag":
      butsaakhText = "Үнэмлэхийн зураг";
      break;
    case "zuvshuurliinZurag":
      butsaakhText = "Зөвшөөрлийн зураг";    
      break;
    case "zoriulalt":
      butsaakhText = "Зориулалт";
      break;
    case "talbainDugaar":
      butsaakhText = "Талбайн дугаар";
      break;
    case "talbainIdnuud":
      butsaakhText = "Талбайн дугаарууд";
      break;
    case "talbainNegjUne":
      butsaakhText = "Талбайн нэгж үнэ";  
      break;
    case "talbainNiitUne":
      butsaakhText = "Талбайн нийт үнэ";  
      break;
    case "talbainKhemjee":
      butsaakhText = "Талбайн хэмжээ";
      break;
    case "talbainKhemjeeMetrKube":
      butsaakhText = "Талбайн хэмжээ m³";
      break;
    case "davkhar":
      butsaakhText = "Давхар";
      break;
    case "baritsaaAvakhDun":
      butsaakhText = "Барьцаа авах дүн"; 
      break;
    case "baritsaaniiUldegdel":
      butsaakhText = "Барьцааны үлдэгдэл";
      break;
    case "baritsaaBairshuulakhKhugatsaa":
      butsaakhText = "Барьцаа байршуулах хугацаа";
      break;
    case "baritsaaAvakhKhugatsaa":
      butsaakhText = "Барьцаа авах хугацаа";
      break;
    case "baiguullagiinId":
      butsaakhText = "Байгууллага";
      break;
    case "baiguullagiinNer":
      butsaakhText = "Байгууллагийн нэр";  
      break;
    case "tulukhUdur":
      butsaakhText = "Төлөх өдөр";  
      break;
    case "sanuulakhKhonog":
      butsaakhText = "Сануулах хоног";
      break;
    case "khuleekhKhonog":
      butsaakhText = "Хүлээх хоног";
      break;
    case "khungulukhEsekh":
      butsaakhText = "Хөнгөлөх эсэх";
      break;
    case "daraagiinTulukhOgnoo":
      butsaakhText = "Дараагийн төлөх огноо";  
      break;
    case "daraagiinSanuulakhOgnoo":
      butsaakhText = "Дараагийн сануулах огноо";
      break;
    case "daraagiinKhuleekhOgnoo":
      butsaakhText = "Дараагийн хүлээх огноо";
      break;
    case "uldegdel":
      butsaakhText = "Үлдэгдэл";
      break;
    case "aldangiinUldegdel":
      butsaakhText = "Алдангийн үлдэгдэл";
      break;
    case "avlaga":
      butsaakhText = "Авлага";  
      break;
    case "dans":
      butsaakhText = "Данс";  
      break;
    case "turGereeEsekh":
      butsaakhText = "Түр гэрээ эсэх";
      break;
    case "zardluud":
      butsaakhText = "Зардлууд";
      break;
    case "segmentuud":
      butsaakhText = "Сегментүүд";
      break;
    case "gereeniiTuukhuud":
      butsaakhText = "Гэрээний түүхүүд";  
      break;
    default:
    break;
  }
  return butsaakhText;
}
module.exports = { zassanBarimtShalgakh }