<script>
	import Title from "$lib/header.svelte";
    import { Styles } from 'sveltestrap';
    import { Col, Container, Row } from 'sveltestrap';       
</script>

<Styles />

<header>
    <Title title="Home" />
</header>

<main>
    <!-- Page Content -->

    <Container>
        <Row>
          <Col><slot></slot></Col>
        </Row>
    </Container>
</main>

<footer>
    <p>A nice wee footer</p>
</footer>
