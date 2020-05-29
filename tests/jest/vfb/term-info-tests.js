const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

import { getUrlFromProjectId } from './cmdline.js';
import { wait4selector, click , closeModalWindow, flexWindowClick} from './utils';
import * as ST from './selectors';

const baseURL = process.env.url ||  'http://localhost:8080/org.geppetto.frontend';
const projectURL = baseURL + "/geppetto?id=VFB_00030624&i=VFB_00017894,VFB_00030624,VFB_00030611,VFB_00030623";

/**
 * Tests term info component. Loads ID VFB_00017894 , and tests term info component to be correctly loaded with metadata for VFB_00017894. 
 */
describe('VFB Term Info Component Tests', () => {
	beforeAll(async () => {
		//increases timeout to 2 minutes
		jest.setTimeout(120000);
		await page.goto(projectURL, {timeout : 120000 });

	});

	describe('Test landing page', () => {
		it('Loading spinner goes away', async () => {
			await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true, timeout : 120000 })
		})

		it('VFB Title shows up', async () => {
			const title = await page.title();
			expect(title).toBe("Virtual Fly Brain");
		})
	})

	//Tests metadata in term info component and clicking on links
	describe('Test Term Info Component Opens on Load with Components', () => {
		//Tests deselect button for VFB_00030624 is present in term info component
		it('Deselect button for VFB_00030624 appears in button bar inside the term info component', async () => {
			await wait4selector(page, '#VFB_00030624_deselect_buttonBar_btn', { visible: true , timeout : 400000 })
		})

		//Tests zoom button for VFB_00030624 is present in term info component
		it('Zoom button for VFB_00030624 appears in button bar inside the term info component', async () => {
			await wait4selector(page, 'button[id=VFB_00030624_zoom_buttonBar_btn]', { visible: true , timeout : 400000 })
		})

		it('Term info component created after load', async () => {
			await wait4selector(page, 'div#VFBTermInfo_el_1_component', { visible: true , timeout : 400000})
		})
		
//		it('Hide Quick Help Modal Window', async () => {
//			closeModalWindow(page);
//			await wait4selector(page, 'div#quick_help_modal', { hidden : true })
//		})

		it('Term info component name correctly populated at startup', async () => {
			await page.waitForFunction('document.getElementById("VFBTermInfo_el_0_component").innerText.startsWith("medulla on adult brain template JFRC2 (VFB_00030624)")');
		})
	})

	describe('Test Term Info Component Minimizes/Maximizes/Opens/Closes', () => {
		it('Term info minimized', async () => {
			// There are three flexlayout_tab components open with the same minimize icon, the third one belongs to the term info
			await flexWindowClick("Term Info","fa-window-minimize");
			//await page.evaluate(async () => document.getElementsByClassName("fa-window-minimize")[2].click());
			// Check 3d viewer is visible again by checking css property 'display : none'
			//await wait4selector(page, 'div#VFBTermInfo_el_0_component', { visible: false , timeout : 400000})
			expect(
					await page.evaluate(async () => document.getElementsByClassName("flexlayout__tab")[2].style.getPropertyValue("display"))
			).toBe("none");
		})

		it('Term info maximized', async () => {
			await page.evaluate(async () => {
				let mouseUp = document.getElementsByClassName('flexlayout__border_button')[0]
				let clickEvent = new MouseEvent('mousedown', {
					view: window,
					bubbles: true,
					cancelable: true
				});
				mouseUp.dispatchEvent(clickEvent);

				let mouseDown = document.getElementsByClassName('flexlayout__border_button')[0]
				clickEvent = new MouseEvent('mouseup', {
					view: window,
					bubbles: true,
					cancelable: true
				});
				mouseDown.dispatchEvent(clickEvent);
			});

			// Check term info component is visible again by checking css property 'display : block'
			expect(
					// There are 3 div elements with class 'flexlayout_tab', the term info component is the third one
					await page.evaluate(async () =>	document.getElementsByClassName("flexlayout__tab")[2].style.getPropertyValue("display"))
			).toBe("block");

			// Looks for zoom button for id 'VFB_00030624', which is present if it's visible
			await wait4selector(page, 'button[id=VFB_00030624_zoom_buttonBar_btn]', { visible: true , timeout : 120000 })
		})	
		it('Term info closed', async () => {
			// There's 4 div elements with same class (slice viewer, 3d viewer, term info and tree browser), the forth one belongs to the term info
			await flexWindowClick("Term Info","flexlayout__tab_button_trailing");
			await wait4selector(page, '#vfbterminfowidget', { visible: false, timeout : 500000})
		})

		it('Term info opened', async () => {
			await page.evaluate(async () => document.getElementById("Tools").click());
			// Check HTML 'UL' with class 'MuiList-root' is visible, this is the drop down menu
			await wait4selector(page, "ul.MuiList-root", { visible: true, timeout : 120000 });
			await page.evaluate(async () => document.getElementById("Term Info").click());
			await wait4selector(page, 'div#vfbterminfowidget', { visible: true, timeout : 500000});
			await wait4selector(page, 'div#VFBTermInfo_el_1_component', { visible: true, timeout : 500000});
		})
	})

	describe('Test Term Info Component Links and Buttons Work', () => {
		it('Term info, hide volume using "Hide 3D Volume"', async () => {
			// Click on Term Info Drop Down Menu
			await page.evaluate(async () => document.querySelectorAll(".focusTermRight button")[0].click());
			await wait4selector(page, 'div#simple-popper', { visible: true, timeout : 50000});
			await page.evaluate(async () => document.getElementById("Hide 3D Volume").click());
			await page.waitFor(2000);
			// Test Canvas Container doesn't have volume mesh visible anymore
			expect(
					await page.evaluate(async () => !CanvasContainer.engine.meshes["VFB_00030624.VFB_00030624_obj"].visible)
			).toBeTruthy();
		})

		it('Term info ,show volume using "Show 3D Volume"', async () => {
			// Click on Term Info Drop Down Menu
			await page.evaluate(async variableName => document.querySelectorAll(".focusTermRight button")[0].click());
			await wait4selector(page, 'div#simple-popper', { visible: true, timeout : 50000});
			// Click on Show 3D Volume menu option
			await page.evaluate(async () => document.getElementById("Show 3D Volume").click());
			await page.waitFor(2000);
			// Test canvas container has volume mesh visible again
			expect(
					await page.evaluate(async () => CanvasContainer.engine.meshes["VFB_00030624.VFB_00030624_obj"].visible)
			).toBeTruthy();
		})

		it('Term info closed', async () => {
			// There's 4 div elements with same class (slice viewer, 3d viewer, term info and tree browser), the third one belongs to the term info
			await page.evaluate(async () =>{
				let flexComponents = document.getElementsByClassName("flexlayout__tab_button_trailing").length;
				document.getElementsByClassName("flexlayout__tab_button_trailing")[flexComponents-1].click();
			});			
			await wait4selector(page, '#vfbterminfowidget', { hidden: true, timeout : 50000})
		})

		it('Term info , open using "Show Info" menu option', async () => {
			// Click on Term Info Drop Down Menu
			await page.evaluate(async variableName => document.querySelectorAll(".focusTermRight button")[0].click());
			await wait4selector(page, 'div#simple-popper', { visible: true, timeout : 50000});
			// Click on 'Show Info' menu selection option
			await page.evaluate(async () => document.getElementById("Show Info").click());
			await wait4selector(page, 'div#vfbterminfowidget', { visible: true, timeout : 50000});
			await wait4selector(page, 'div#VFBTermInfo_el_0_component', { visible: true, timeout : 50000});
		})

		it('Term info , run "Query For" from menu option', async () => {
			// Takes a while for 'Query For' option to show, wait for it 20 seconds
			await page.waitFor(20000);
			// Click on Term Info Drop Down Menu
			await page.evaluate(async variableName => document.querySelectorAll(".focusTermRight button")[0].click());
			await wait4selector(page, 'div#simple-popper', { visible: true, timeout : 50000});
			// Mouse over 'Query For' menu item to expand drop down menu
			await page.evaluate(async () => {
				let hover = document.querySelectorAll("[id='Query for'] .fa-chevron-right")[0];
				let hoverEvent = new MouseEvent('mouseover', {
					view: window,
					bubbles: true,
					cancelable: true
				});
				hover.dispatchEvent(hoverEvent);
			});
			await page.waitFor(1000);
			// Click on item from query drop down menu and expect the query modal window to open
			await page.evaluate(async () => document.getElementById("List all example images of medulla").click());
			await wait4selector(page, '#query-results-container', { visible: true, timeout : 50000});
		})

		// Close Query Results window by pressing Escape on Window
		it('Close Query Results Window', async () => {
			closeModalWindow(page);
			await wait4selector(page, '#query-results-container', { hidden: true, timeout : 50000});
		})

		it('Term info correctly populated after clicking on Source Link', async () => {
			await page.evaluate(async variableName => $(variableName).find("a").click(), "#VFBTermInfo_el_1_component");
			await page.waitForFunction('document.getElementById("VFBTermInfo_el_0_component").innerText.startsWith("BrainName neuropils on adult brain JFRC2 (Jenett, Shinomya) (JenettShinomya_BrainName)")');
		})
	})

	describe('Test Term Info Icon Buttons Work', () => {
		it('Term info, "Spotlight" Button Works', async () => {
			await page.evaluate(async variableName => $(variableName).click(), "i.fa-search");
			await wait4selector(page, ST.SPOT_LIGHT_SELECTOR, {visible: true, timeout : 50000});
			// Close Spotlight
			closeModalWindow(page);
			await wait4selector(page, ST.SPOT_LIGHT_SELECTOR, { hidden: true, timeout : 50000});
		})

		it('Term info, "Control Panel" Button Works', async () => {
			await page.evaluate(async variableName => $(variableName).click(), "i.fa-list");
			await wait4selector(page, ST.CONTROL_PANEL_SELECTOR, { visible: true , timeout : 50000 });
			const rows = await page.evaluate(async selector => $(selector).length, ST.STANDARD_ROW_SELECTOR);
			expect(rows).toEqual(4);
			// Close Control Panel
			closeModalWindow(page);
			await wait4selector(page, ST.CONTROL_PANEL_SELECTOR, { hidden: true, timeout : 50000});
		})

		it('Term info, "Query Button" Works', async () => {
			await page.evaluate(async variableName => $(variableName).click(), "i.fa-quora");
			await wait4selector(page, '#query-results-container', { visible: true ,timeout : 50000 });
			// Close Query Panel
			closeModalWindow(page);
			await wait4selector(page, '#query-results-container', { hidden: true, timeout : 50000});
		})

		it('Term info, "Clear All" Button Works', async () => {
			await page.evaluate(async variableName => $(variableName).click(), "i.fa-eraser");
			await page.waitForFunction('document.getElementById("VFBTermInfo_el_0_component").innerText.startsWith("adult brain template JFRC2 (VFB_00017894)")');
		})
	})
})