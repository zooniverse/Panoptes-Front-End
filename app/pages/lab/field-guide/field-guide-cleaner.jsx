import { useState } from 'react'

export default function FieldGuideCleaner ({
  fieldGuide,
  icons = {},
}) {
  if (!fieldGuide) return

  const [dataStatus, setDataStatus] = useState('idle')

  console.log('+++ fieldGuide: ', fieldGuide)
  console.log('+++ icons: ', icons)

  const activeIconIds = fieldGuide.items.map(item => item.icon)

  const allIcons = Object.entries(icons).map(([id, resource]) => ({ id, resource }))
  const allIconIds = allIcons.map(icon => icon.id)

  return (
    <div>
      <h4>Field Guide Cleaner</h4>
      <p>Beep boop, here are the icons actually used by the field guide. ✔️ means it's working fine, ❌ means it's orphaned (i.e. somehow the associated icon isn't in the list of the field guide's attached_images)</p>
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
      <p>Now here are ALL the icons (attached_images) linked with this field guide. Each has a Resource we can .delete() btw.</p>
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