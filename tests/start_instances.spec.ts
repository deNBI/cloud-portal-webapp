import {test} from '@playwright/test';
import {MEMBER_STORAGE} from "./global-setup";
import {NewInstancePage} from "./page_objects/new_instance.po";
import {Util} from "./util";
import {InstanceOverviewPage} from "./page_objects/instance_overview.po";

test.describe.serial('@start_simpleVM', () => {

	test.describe('Should start a VM without volume', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @start_simpleVM', async ({ page, baseURL }) => {
			const addVMPage = new NewInstancePage(page, baseURL);
			await addVMPage.goto();
			await addVMPage.selectProject(Util.SIMPLE_VM_APPLICATION_NAME);
			await addVMPage.startNormalVM(Util.SIMPLE_VM_APPLICATION_NAME, false);
		});
	});

	/*test.describe('Should see active VM in instance overview', () => {
		test.use({storageState: MEMBER_STORAGE});
		test('Member @start_simpleVM', async ({ page, baseURL }) => {
			const vmOverviewPage = new InstanceOverviewPage(page, baseURL);
			await vmOverviewPage.goto();
			await vmOverviewPage.waitForNormalInstanceToBeActive();
		});
	}); */
});
