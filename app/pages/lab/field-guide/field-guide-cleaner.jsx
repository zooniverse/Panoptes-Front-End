/*
Field Guide Cleaner
This admin-only debugging tool used to remove "orphaned icons"
(attached_images) from a Field Guide. As it turns out, sometimes, if you
delete an icon from a Field Guide page, or delete a page with an icon, that
icon isn't always removed from the field guide's associated attached_images.

- Created Jan 2026 to solve a specific problem with Field Guides. Some
  prevention to the problem would be nice, but we only have a cure at the
  moment.
- Uh, this may need to be expanded into Tutorials at some point; we haven't
  fully ruled out a similar "orphaned attached_images" problem there.
- See https://github.com/zooniverse/Panoptes-Front-End/issues/7405
- This component should only be placed inside
  Project Builder -> edit Field Guide page.

Input:
- fieldGuide: field guide resource.
- icons: ALL icons (attached_images) associated with the field guide. Should be
  a in the format of...
  { 'id1': resource1, 'id2': resource2, ... }
 */

import { useEffect, useState } from 'react'

export default function FieldGuideCleaner ({
  fieldGuide,
  icons = {},
  userIsAdmin = false,
}) {
  if (!fieldGuide || !userIsAdmin) return null

  const [dataStatus, setDataStatus] = useState('ready')
  const [workProgress, setWorkProgress] = useState(0)

  const activeIconIds = fieldGuide.items.map(item => item.icon)

  const allIcons = Object.entries(icons).map(([id, resource]) => ({ id, resource }))
  const allIconIds = allIcons.map(icon => icon.id)

  useEffect(function onFieldGuideChange () {
    setDataStatus('ready')
  }, [fieldGuide])

  async function doCleanUp () {
    if (dataStatus !== 'ready') return

    try {

      setDataStatus('working')
      setWorkProgress(0)

      for (let i = 0 ; i < allIcons.length ; i ++) {
        setWorkProgress(i)
        const { id, resource } = allIcons[i]
        const hasMatch = activeIconIds.includes(id)
        if (!hasMatch) {
          console.log('Deleting ', id)
          await resource.delete()
        }
      }

      setDataStatus('done')

    } catch (err) {
      console.error(err)
      setDataStatus('error')
    }
  }

  return (
    <div style={{ border: '1px solid #a0a0a0', borderRadius: '0.5em', padding: '0.5em' }}>
      <h4>[ADMIN] Field Guide Cleaner</h4>
      <p>This tool should be used by admins to clean up "orphaned images" associated with this Field Guide. See <a href="https://github.com/zooniverse/Panoptes-Front-End/issues/7405">PFE Issue 7405.</a></p>
      <p>Here are the icons actually used by the field guide. ✔️ means it's working fine, ❌ means it's orphaned (i.e. somehow the associated icon isn't in the list of the field guide's attached_images). Uh, if anything below here is orphaned, please talk to our devs because I have no idea how it happened.</p>
      <ol>
        {fieldGuide.items.map((item, index) => {
          const hasMatch = allIconIds.includes(item.icon)

          if (!item.icon) {
            return (
              <li key={item._key}>✔️ Page {index+1} has no icon</li>
            )
          } else {
            return (
              <li key={item._key}>{hasMatch ? '✔️' : '❌'} Page {index+1} has icon {item.icon}</li>
            )
          }
        })}
      </ol>
      <p>Now here are ALL the icons (attached_images) linked with this field guide. ✔️ means the icon is attached to a page, ❌ means it's orphaned. If you see any orphaned images, then clicking the button below should fix the problem.</p>
      <div>
        {(dataStatus === 'ready') ? (
          <button onClick={doCleanUp}>Clean up unused icons</button>
        ) : (dataStatus === 'working') ? (
          <span>
            Working... ({workProgress+1} / {allIcons.length})
          </span>
        ) : (dataStatus === 'done') ? (
          <span>
            Done! Please refresh the page.
          </span>
        ) : (dataStatus === 'error') ? (
          <span>
            ERROR
          </span>
        ) : (
          <span>
            ???
          </span>
        )}
      </div>
      <ol>
        {allIcons.map((icon, index) => {
          const hasMatch = activeIconIds.includes(icon.id)

          return (
            <li key={icon.id}>{hasMatch ? '✔️' : '❌'} icon {icon.id}</li>
          )
        })}
      </ol>
    </div>
  )


}