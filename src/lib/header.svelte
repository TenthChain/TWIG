<script>
	import {
		Collapse,
		Navbar,
		NavbarToggler,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink,
		Dropdown,
		DropdownToggle,
		DropdownMenu,
		DropdownItem
	} from 'sveltestrap';

	export let title = '';
	let isOpen = false;

	//@ts-ignore
	function handleUpdate(event) {
		isOpen = event.detail.isOpen;
	}

	let fullTitle = title ? `TWIG - ${title}` : `TWIG`;
</script>

<title>{fullTitle}</title>

<Navbar color="light" light expand="md">
	<NavbarBrand href="/">{fullTitle}</NavbarBrand>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
		<Nav class="ms-auto" navbar>
			<NavItem>
				<NavLink href="#components/">Components</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="https://github.com/bestguy/sveltestrap">GitHub</NavLink>
			</NavItem>
			<Dropdown nav inNavbar>
				<DropdownToggle nav caret>Pages</DropdownToggle>
				<DropdownMenu end>
					<DropdownItem>Home</DropdownItem>
					<DropdownItem>Option 2</DropdownItem>
					<DropdownItem divider />
					<DropdownItem>Reset</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</Nav>
	</Collapse>
</Navbar>