import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import DataExportDownloadLink from './data-export-download-link';

describe('DataExportDownloadLink', function () {
    let project;
    let wrapper;

    before(function () {
        project = { get: sinon.fake.resolves("foo") }
        wrapper = shallow(<DataExportDownloadLink project={project} exportType="fake_export" />);
    });

    it('renders without crashing', function () {
        const container = wrapper.find('span');
        assert.equal(container.length, 1);
    });

    it('loads the exports', function () {
        assert.equal(project.get.lastArg, "fake_export");
    });

    it('renders a link to the export', function (done) {
        const href = "https://foo.bar/file.csv";
        project.get = sinon.fake.resolves([{ metadata: { state: 'ready' }, src: href, updated_at: "2019-01-01T23:12:10Z" }]);
        wrapper = shallow(<DataExportDownloadLink project={project} exportType="fake_export" />);
        wrapper.instance().getExport().then(() => {
            assert.equal(wrapper.find('a').prop('href'), href);
        }).then(done, done);
    });

    it('renders an error when panoptes fails', function (done) {
        project.get = sinon.fake.resolves({errors: "Something went wrong. Oops"});
        wrapper = shallow(<DataExportDownloadLink project={project} exportType="fake_export" />);
        wrapper.instance().getExport().then(() => {
            assert.equal(wrapper.text(), "Error loading export information");
        }).then(done, done);
    });

    it('renders a message when export is still generating', function (done) {
        project.get = sinon.fake.resolves([{ metadata: { state: 'pending' }}]);
        wrapper = shallow(<DataExportDownloadLink project={project} exportType="fake_export" />);
        wrapper.instance().getExport().then(() => {
            assert.equal(wrapper.text(), "Export is being generated.");
        }).then(done, done);
    });

    it('renders a message when export was never requested', function (done) {
        project.get = sinon.fake.resolves([]);
        wrapper = shallow(<DataExportDownloadLink project={project} exportType="fake_export" />);
        wrapper.instance().getExport().then(() => {
            assert.equal(wrapper.text(), 'Never previously requested.');
        }).then(done, done);
    });
});

