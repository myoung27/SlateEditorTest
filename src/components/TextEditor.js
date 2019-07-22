import React from 'react'
import { SlateEditor, SlateToolbar, SlateContent } from 'slate-editor'
import { BoldPlugin, BoldButton } from '@slate-editor/bold-plugin'
import { ItalicPlugin, ItalicButton } from '@slate-editor/italic-plugin'
import { UnderlinePlugin, UnderlineButton } from '@slate-editor/underline-plugin'
import { StrikethroughPlugin, StrikethroughButton } from '@slate-editor/strikethrough-plugin'
import { AlignmentPlugin, AlignmentButtonBar } from '@slate-editor/alignment-plugin'
import { ColorPlugin, ColorButton, ColorStateModel } from '@slate-editor/color-plugin'
import { FontFamilyPlugin, FontFamilyDropdown } from '@slate-editor/font-family-plugin'
import { FontSizePlugin, FontSizeInput } from '@slate-editor/font-size-plugin'
import { ImagePlugin, ImageButton } from '@slate-editor/image-plugin'
import { LinkPlugin, LinkButton } from '@slate-editor/link-plugin'

import { FaBold } from 'react-icons/fa'


const colorPluginOptions = new ColorStateModel().rgba({ r: 100, g: 100, b: 100, a: 1 }).gen()

const fontSizePluginOptions = { initialFontSize: 16 }
const boldbutton = { FaBold }
 
const plugins = [BoldPlugin(),ItalicPlugin(),StrikethroughPlugin(),LinkPlugin(), ImagePlugin(), UnderlinePlugin(),AlignmentPlugin(),ColorPlugin(),FontFamilyPlugin(),FontSizePlugin(fontSizePluginOptions),]
 
const SlateRichTextEditor = () => (
  <SlateEditor plugins={plugins}>
    <SlateToolbar>
      <FontFamilyDropdown />
      <FontSizeInput {...fontSizePluginOptions} />
      <BoldButton/>
      <ItalicButton />
      <UnderlineButton />
      <StrikethroughButton />
      <ColorButton
        initialState={colorPluginOptions}
        pickerDefaultPosition={{ x: -520, y: 17 }}
      />
      <AlignmentButtonBar />
      <ImageButton
        signingUrl={
          process.env.REACT_APP_API_URL +
          process.env.REACT_APP_SIGNING_URL_ENDPOINT
        }
      />
      <LinkButton/>
    </SlateToolbar>
    <SlateContent />
  </SlateEditor>
)
 
export default SlateRichTextEditor