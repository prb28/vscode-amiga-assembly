import { expect } from 'chai';
import * as chai from 'chai';
import { mock, instance, when, anyNumber } from 'ts-mockito';
import { DummyVariableResolver } from './dummyVariableResolver';
import { MemoryLabelsRegistry } from '../customMemoryAddresses';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

describe("Custom memory address register", function () {
    // tslint:disable:no-unused-expression
    it("Should retrieve the copper address", async function () {
        let mockedVariableResolver = mock(DummyVariableResolver);
        when(mockedVariableResolver.getMemory(0xdff080, anyNumber())).thenResolve("00f000ff");
        let variableResolver = instance(mockedVariableResolver);
        await expect(MemoryLabelsRegistry.getCopperAddress(1, variableResolver)).to.be.eventually.equal(0xf000ff);
    });
});