import { expect } from "chai";
import { ConfigurationHelper } from "../configurationHelper";

describe("ConfigurationHelper Tests", function () {
    it("Should retrieve a string configuration", function () {
        const conf = ConfigurationHelper.getDefaultConfiguration(null);
        // tslint:disable-next-line: no-unused-expression
        expect(conf).to.be.not.undefined;
        let value = ConfigurationHelper.retrieveStringPropertyInDefaultConf("logLevel");
        expect(value).to.be.equal("info");
        value = ConfigurationHelper.retrieveStringProperty(conf, "xxxxx", "default");
        expect(value).to.be.equal("default");
    });
    it("Should retrieve a boolean configuration", function () {
        const conf = ConfigurationHelper.getDefaultConfiguration(null);
        // tslint:disable-next-line: no-unused-expression
        expect(conf).to.be.not.undefined;
        let value = ConfigurationHelper.retrieveBooleanProperty(conf, "downloadBinaries", false);
        expect(value).to.be.equal(true);
        value = ConfigurationHelper.retrieveBooleanProperty(conf, "xxxxx", false);
        expect(value).to.be.equal(false);
    });
    it("Should retrieve a number configuration", function () {
        const conf = ConfigurationHelper.getDefaultConfiguration(null);
        // tslint:disable-next-line: no-unused-expression
        expect(conf).to.be.not.undefined;
        let value = ConfigurationHelper.retrieveNumberProperty(conf, "format.labelToInstructionDistance", 70);
        expect(value).to.be.equal(2);
        value = ConfigurationHelper.retrieveNumberProperty(conf, "xxxxx", 70);
        expect(value).to.be.equal(70);
    });
});