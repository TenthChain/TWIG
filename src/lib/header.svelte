<script>
	import { env } from "$env/dynamic/public";
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
		DropdownItem,
		Tooltip,
		Icon
	} from 'sveltestrap';

	export let title = '';
	let isOpen = false;
    // const record = await pb.collection("settings").getOne("pds4l4a8k1jjtvm");

	//@ts-ignore
	function handleUpdate(event) {
		isOpen = event.detail.isOpen;
	}
	
	let serverDetails;
	let fullTitle = title ? `TWIG - ${title}` : `TWIG`;
</script>

<title>{fullTitle}</title>

<Navbar color="light" light expand="md">
	<NavbarBrand href="/"><Icon name="tree"/>&nbsp;{fullTitle}</NavbarBrand>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
		<Nav class="ms-auto" navbar>
			<NavItem>
				<NavLink href="#components/">Components</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="https://github.com/bestguy/sveltestrap">GitHub</NavLink>
			</NavItem>
			<NavItem>
				<NavLink><div bind:this={serverDetails}><Icon name="hdd-network-fill"/>&nbsp;Status</div></NavLink>
				<Tooltip target={serverDetails}>Address - {env.PUBLIC_tree_url}</Tooltip>
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