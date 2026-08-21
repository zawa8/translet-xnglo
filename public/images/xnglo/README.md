# xNglo chart images

Local, self-hosted images for the xNglo chart tiles. Reference these with
the `local()` helper in `app/kilas1/charts/xNglo/page.tsx`:

```ts
imgSrc: local("mango.jpg")
```

Most existing tile images currently hotlink to Wikimedia Commons via the
`wm()` helper. Drop a file here and switch a tile to `local()` when you
want that image self-hosted instead.
