import {test} from '@playwright/test';
import {MEMBER_STORAGE} from "./global-setup";
import {NewInstancePage} from "./page_objects/new_instance.po";
import {Util} from "./util";

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
});
