import { FolderIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { PlayIcon, ReloadIcon } from '@radix-ui/react-icons'
import React, { useCallback, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import {
  enableFileManagerState,
  fileState,
  isInpaintingState,
  isPix2PixState,
  isSDState,
  maskState,
  runManuallyState,
  showFileManagerState,
} from '../../store/Atoms'
import Button from '../shared/Button'
import Shortcuts from '../Shortcuts/Shortcuts'
import { ThemeChanger } from './ThemeChanger'
import SettingIcon from '../Settings/SettingIcon'
import PromptInput from './PromptInput'
import CoffeeIcon from '../CoffeeIcon/CoffeeIcon'
import Plugins from '../Plugins/Plugins'
import emitter, {
  DREAM_BUTTON_MOUSE_ENTER,
  DREAM_BUTTON_MOUSE_LEAVE,
  EVENT_CUSTOM_MASK,
  RERUN_LAST_MASK,
} from '../../event'
import { useImage } from '../../utils'
import useHotKey from '../../hooks/useHotkey'

const Header = () => {
  const isInpainting = useRecoilValue(isInpaintingState)
  const [file, setFile] = useRecoilState(fileState)
  const [mask, setMask] = useRecoilState(maskState)
  const [maskImage, maskImageLoaded] = useImage(mask)
  const [uploadElemId] = useState(`file-upload-${Math.random().toString()}`)
  const [maskUploadElemId] = useState(`mask-upload-${Math.random().toString()}`)
  const isSD = useRecoilValue(isSDState)
  const isPix2Pix = useRecoilValue(isPix2PixState)
  const runManually = useRecoilValue(runManuallyState)
  const [openMaskPopover, setOpenMaskPopover] = useState(false)
  const [showFileManager, setShowFileManager] =
    useRecoilState(showFileManagerState)
  const enableFileManager = useRecoilValue(enableFileManagerState)

  useHotKey(
    'f',
    () => {
      if (enableFileManager && !isInpainting) {
        setShowFileManager(!showFileManager)
      }
    },
    {},
    [showFileManager, enableFileManager, isInpainting]
  )

  const handleRerunLastMask = useCallback(() => {
    emitter.emit(RERUN_LAST_MASK)
  }, [])

  const onRerunMouseEnter = () => {
    emitter.emit(DREAM_BUTTON_MOUSE_ENTER)
  }

  const onRerunMouseLeave = () => {
    emitter.emit(DREAM_BUTTON_MOUSE_LEAVE)
  }

  useHotKey(
    'r',
    () => {
      if (!isInpainting) {
        handleRerunLastMask()
      }
    },
    {},
    [isInpainting, handleRerunLastMask]
  )

  const renderHeader = () => {
    return (
      <header>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {enableFileManager ? (
            <Button
              icon={<FolderIcon />}
              style={{ border: 0 }}
              toolTip="Open File Manager"
              disabled={isInpainting}
              onClick={() => {
                setShowFileManager(true)
              }}
            />
          ) : (
            <></>
          )}

          {/* <label htmlFor={uploadElemId}>
            <Button
              icon={<PhotoIcon />}
              style={{ border: 0, gap: 0, padding: 6 }}
              disabled={isInpainting}
              toolTip="上传图片"
            >
              <input
                style={{ display: 'none' }}
                id={uploadElemId}
                name={uploadElemId}
                type="file"
                onChange={ev => {
                  const newFile = ev.currentTarget.files?.[0]
                  if (newFile) {
                    setFile(newFile)
                  }
                }}
                accept="image/png, image/jpeg"
              />
            </Button>
          </label> */}
        </div>

        {(isSD || isPix2Pix) && file ? <PromptInput /> : <></>}

        <div className="header-icons-wrapper">
          {/* <CoffeeIcon /> */}
          {/* <ThemeChanger /> */}
          {/* <HumanRemove /> */}
          <Plugins />
          <div className="header-icons">
            {/* <Shortcuts /> */}
            {/* <SettingIcon /> */}
          </div>
        </div>
      </header>
    )
  }
  return renderHeader()
}

export default Header
