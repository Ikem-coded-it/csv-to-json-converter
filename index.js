const CSVToJSON = require("csvtojson");
const json2csv = require("json2csv").parse;
const fs = require("fs");
const { createHash } = require("node:crypto");
const path = "./HNGI9 CSV FILE.csv";
const pc = require("prompt-sync");
const prompt = pc();

let jsonArray = [];


// get file path from user
const getPath = () => {
    let file = prompt("Enter filename without extension: ");
    const path = "./" + file + ".csv"
    return path;
}


// convert csv to json
CSVToJSON().fromFile(getPath())
.then(jsonData => {
    // convert json format to CHIP-OO07
    jsonData.forEach(data => {
        const newJSON = {
            format: "CHIP-0007",
            name: data["Filename"],
            description: data["Description"],
            minting_tool:  data["TEAM NAMES"],
            sensitive_content: false,
            series_number: parseInt(data["Series Number"]),
            series_total: jsonData.length,
            attributes: [{
                name: data["Name"],
                gender: data["Gender"],
                about: data["Attributes"]
            }],
            collection: {
                name: "Zuri NFT for free lunch",
                id: data["UUID"],
                attributes: {
                    type: "about",
                    value: "Prize for doing something cool in HNGi9."
                }
            }

        }

        // hash json data with sha256
        const hashedJSON = createHash("sha256")
                          .update(toString(newJSON))
                          .digest("hex")
         
        // append sha256 hash                  
        newJSON["hash"] = hashedJSON;

        jsonArray.push(newJSON)

        // comvert back to csv format
        const csv = json2csv(jsonArray, { fields: [
            "format", "name", "description", "minting_tool", "sensitive_content", "series_number",
            "series_total", "attributes", "collection", "hash"
        ]}
        )

        // create new csv file
        fs.writeFileSync("./newCsvFile.csv", csv);
    })
})