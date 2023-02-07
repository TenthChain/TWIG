<script>
    export let title = "";

    let fullTitle = title ? `TWIG - ${title}` : `TWIG`
</script>

<section class="header">
    <div>
        <h1 id="title">{fullTitle}</h1>
    </div>
    <div>
        <a href="" class="nav">Home</a>
        <a href="" class="nav">Set LEDs</a>
    </div>
</section>

<style>
    section.header {
        background-color: aqua;
        width: 100%;
        height: 25px;
    }
</style>