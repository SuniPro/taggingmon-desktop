import { Menu, MenuItem, Submenu, PredefinedMenuItem } from '@tauri-apps/api/menu';
import { useEffect } from 'react';

export const useMenuMacOS = () => {
	useEffect(() => {
		console.log('created Menu!');

		(async () => {
			const subMenu = await Submenu.new({
				id: 'about',
				text: 'about12',
				items: [
					await MenuItem.new({
						id: 'menu',
						text: 'menu',
						action: () => {
							console.log('menu1 clicked@');
						},
					}),
					await MenuItem.new({
						id: 'menu2',
						text: 'menu2',
						action: () => {
							console.log('menu2 clicked@');
						},
					}),
					await PredefinedMenuItem.new({
						text: '닫기',
						item: 'CloseWindow',
					}),
				],
			});

			const menu = await Menu.new({
				items: [subMenu],
			});

			menu
				.setAsAppMenu()
				.then(res => {
					console.log('menu set success', res);
				})
				.catch(err => {
					console.log('---');
					console.log(err);
				});
		})();
	}, [new Date()]);

	return null;
};
