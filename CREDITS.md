# Credits

## 3D figure ("Show me in 3D")
- **The person** is "Male_Adult_02" from the **Microsoft Rocketbox Avatar Library**
  (<https://github.com/microsoft/Microsoft-Rocketbox>), © 2020 Microsoft, released under the **MIT licence**.
  The full licence text is in [`figure/model/LICENSE-Rocketbox.txt`](figure/model/LICENSE-Rocketbox.txt).
  We converted the original FBX to glTF (FBX2glTF), shrank the textures to 1024 px WebP, kept 47 of the face shape keys
  (the ARKit-style set the cues need) and compressed it with glTF-Transform and meshopt. The result is `figure/model/person.glb` (about 0.75 MB).
  The faces in the background ("other people" in group cues) are see-through copies of the same model.
- **Animation**: a small invisible skeleton in `figure/viewer.js` is posed from hand-written keyframes in `figure/cues3d.js`
  (our own summaries of the cues). `figure/person.js` copies that skeleton onto the Rocketbox bones and drives its face shape keys.
  The chair, door, phone, pen, cup, watch and wallet are simple shapes made in code for this site.
- **three.js** (r170) renders the scene. It is © three.js authors under the [MIT licence](https://github.com/mrdoob/three.js/blob/dev/LICENSE)
  and is loaded from the jsDelivr CDN only when a figure is opened. OrbitControls, GLTFLoader, SkeletonUtils and the meshopt decoder come from the same package.
- No photos of real people are used.

## Content
All frameworks belong to Chase Hughes, *The Behavior Ops Manual* (2023). This site paraphrases them with page references and reproduces no book text.
